const TeacherRepository = require('../repository/teacher-repository');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

//const UserRepository = require('../repository/user-repository');
const {JWT_KEY} = require('../config/serverConfig');

class TeacherService {
    constructor(){
        this.teacherRepository = new TeacherRepository();
    }

    async create(data){
        try {
            const user = await this.teacherRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }
    async get(data){
            try {
                const user = await this.teacherRepository.getByEmail(data);
                return user;
            } catch (error) {
                console.log("Something went wrong in the service layer");
                throw error;
            }
        }
        async signIn(email,plainPassword){
            try {
                const user = await this.teacherRepository.getByEmail(email);
                console.log(user.password);
                console.log(plainPassword);
                const passwordsMatch = this.checkPassword(plainPassword,user.password);
                if(!passwordsMatch){
                    console.log("Password doesn't match");
                    throw {error: 'Incorrect Password'};
                }
                const newJWT = this.createToken({email : user.email,id:user.id});
                return newJWT;
            } catch (error) {
                console.log("Something went wrong in the sign in process");
                throw error;
            }
        }
    
        async isAuthenticated(token) {
            try {
                const response = this.verifyToken(token);
                if(!response) {
                    throw {error: 'Invalid token'}
                }
                const user = await this.convenorRepository.getById(response.id);
                if(!user) {
                    throw {error: 'No user with the corresponding token exists'};
                }
                return user.id;
            } catch (error) {
                console.log("Something went wrong in the auth process");
                throw error;
            }
        }
    
        createToken(user){
            try{
                const result = jwt.sign(user,JWT_KEY,{expiresIn:'1h'});
                return result;
            }catch(error){
                console.log("Something went wrong in token creation");
                throw error;
            }
        }
    
        verifyToken(token){
            try {
                const response = jwt.verify(token,JWT_KEY);
                return response;
            } catch (error) {
                console.log("Something went wrong in token validation");
                throw error;
            }
        }
    
        checkPassword(userInputPlainPassword,encryptedPassword){
            try {
                return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
            } catch (error) {
                console.log("Something went wrong in password comparison");
                throw error;
            }
        }
    
}

module.exports = TeacherService;