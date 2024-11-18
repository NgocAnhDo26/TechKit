const { db } = require('../db/init');

exports.register = (req, res) => {
    const { email, password, confirmPassword } = req.body;

    db.query(
        'SELECT email FROM customer WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.render('register', {
                    message: 'An error occurred. Please try again.',
                });
            }
            if (results.length > 0) {
                return res.render('register', {
                    message: 'That email is already in use',
                });
            } else if (password !== confirmPassword) {
                return res.render('register', {
                    message: 'Passwords do not match',
                });
            }

            db.query('INSERT INTO customer SET ?', { email: email, password: password }, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.render('register', {
                        message: 'An error occurred. Please try again.',
                    });
                } else {
                    console.log(results);
                    return res.render('register', {
                        message: 'User registered successfully',
                    });
                }
            });
        }
    );
};