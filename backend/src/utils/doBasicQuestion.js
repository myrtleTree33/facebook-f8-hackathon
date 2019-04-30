import User from '../models/User';


const checkDoBasicQuestion = (userId) => {
    // TODO
    // check user's three records
    // return true or false   
    const user = User.findOne({
        userId
    });

    console.log(user)
    return user.cities && user.citiesInterested && user.citiesTraveled? true : false;
};
  
export default checkDoBasicQuestion;
  