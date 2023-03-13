const User = require('@models/user.model');
class UserController {
    static async createUser(req, res) {
        const { name, age, address } = req.body;
        try {
            const newUser = new User({
                name,
                age,
                address,
            });
            const savedUser = await newUser.save();
            return res.status(201).json(savedUser?._doc);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async getUsers(req, res) {
        try {
            const queryObject = { ...req.query };
            const excludedFields = ['page', 'sort', 'limit', 'search', 'fields'];
            excludedFields.forEach((item) => delete queryObject[item]);
            let queryString = JSON.stringify(queryObject);
            //console.log(queryString); //{"age":{"lt":"20"}}
            queryString = queryString.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);
            //console.log(queryString); //{"age":{"$lt":"20"}}
            let query = User.find(JSON.parse(queryString));
            //Sorting
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',');
                const sortArr = sortBy.map((item) => {
                    // console.log(item.indexOf('-'));
                    if (item.indexOf('-') < 0) {
                        return {
                            [item.replace('-', '')]: 1,
                        };
                    } else {
                        return {
                            [item.replace('-', '')]: -1,
                        };
                    }
                });
                let sortObject;
                for (let i = 0; i < sortArr.length; i++) {
                    sortObject = { ...sortObject, ...sortArr[i] };
                }
                // console.log(sortObject);
                query = query.sort(sortObject);
            } else {
                query = query.sort('-createdAt');
            }
            //Searching name using index
            if (req.query.search) {
                const search = req.query.search;
                query = User.find({
                    $text: {
                        $search: search,
                    },
                });
            }
            //Limiting field
            if (req.query.fields) {
                const fields = req.query.fields.split(',').join('');
                query = query.select(fields);
            } else {
                query = query.select('-__v');
            }
            //pagination
            const page = +req.query.page * 1 || 1;
            const limit = +req.query.limit * 1 || 5;
            const skip = limit * (page - 1);
            query = query.limit(limit).skip(skip);
            const userCount = await User.countDocuments();
            const pageCount = Math.ceil(userCount / limit);
            if (req.query.page) {
                if (skip >= userCount) {
                    return res.status(404).json({
                        message: 'This page is not exists',
                    });
                }
            }
            const users = await query;
            return res.status(200).json({
                users,
                totalUser: userCount,
                totalPage: pageCount,
                currentPage: page,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
module.exports = UserController;
