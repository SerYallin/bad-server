import UserModel from '../models/user';

export const loadUsers = async () => {
    const count = await UserModel.countDocuments();
    if (!count) {
        UserModel.insertMany([{
                "name": "Admin",
                "email": "admin@mail.ru",
                "password": "5f4dcc3b5aa765d61d8327deb882cf99",
                "roles": ["admin"],
            },
            {
                "name": "First Customer",
                "email": "user1@mail.ru",
                "password": "7c6a180b36896a0a8c02787eeafb0e4c",
                "roles": ["customer"],
            }]);
    }
}
