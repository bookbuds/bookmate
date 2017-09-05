//=========================
// USER MODEL
//=========================
function User(sequelize, DataTypes) {
    //object with the data field assignments
    const userData =
        {
            user_name:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate:
                {
                    len: [1, 140]
                }
            },

            email:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate:
                {
                    len: [3, 140]
                }

            },

            password:
            {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [8, 100]
                }
            },
            gender:
            {
                type: DataTypes.STRING,
                defaultValue: 'female',
            },
            location:
            {
                type: DataTypes.STRING,
                defaultValue: 'antarctica'
            },
            profile_img_url:
            {
                type: DataTypes.STRING,
                defaultValue: 'http://via.placeholder.com/150x200'
            }
        }

    const tempUser = sequelize.define("User", userData);

    //SET UP LINK TABLE
    tempUser.associate = function (tModels) {
        tempUser.belongsToMany(tModels.Book, { through: 'UserBook', unique: false });

        //CONVERSATIONS
        //tempUser.hasMany( tModels.Conversation, { through: 'Conversations' } );
    }

    return tempUser;
}

//=========================
// EXPORTS
//=========================
module.exports = User;