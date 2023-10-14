exports.registerValidation = async (name, email, password, checkEmail, validateEmail, res, User, moment) => {

    if (name == undefined) {
        res.status(400).json({
            success: false,
            message: "Please enter your name"
        })
    }
    else if (name.length < 3) {
        res.status(400).json({
            success: false,
            message: "Name should be 3 character or more"
        })
    }
    else if (name.length > 20) {
        res.status(400).json({
            success: false,
            message: "Name cannot be greater than 20 character"
        })
    }
    else if (email == undefined) {
        res.status(400).json({
            success: false,
            message: "Please enter your email"
        })
    }
    else if (!validateEmail(email)) {
        res.status(400).json({
            success: false,
            message: "Invalid email address"
        })
    }
    else if (password == undefined) {
        res.status(400).json({
            success: false,
            message: "Please enter your password"
        })
    }
    else if (password.length < 8) {
        res.status(400).json({
            success: false,
            message: "Password should be greater than 8 character"
        })
    }
    else if (password.length > 20) {
        res.status(400).json({
            success: false,
            message: "Password cannot be greater than 20 character"
        })
    }
    else if (checkEmail) {
        res.status(400).json({
            success: false,
            message: "User already exist with this email"
        })
    }
    else {
        const user = await User.create({ name, email, password });
        const token = user.getJWTToken();
        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user,
            accountCreatedOn: moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
            token
        });
    }

}