const express = require("express");

const {users} = require("../data/users.json");

const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

router.get('/:id', (req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=> each.id ===id)
    if(!user){
       return res.status(404).json({
            success: false,
            message:"User does not exist."
        })
    }
    return res.status(200).json({
        success: true,
        data: user
    })
})
router.post('/', (req,res)=>{
    const {id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);

    if(user){
       return res.status(404).json({
            success: false,
            message:"User with the id already exists"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionDate,
        subscriptionType
    })
    return res.status(201).json({
        success: true,
        data: users
    })
})


router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'User doesnot exist'
        })
    }
        let updatedUser = users.map((each)=>{
            if(each.id === id){
                return {
                ...each,
                ...data
            }
        }
        return each;
    })
    return res.status(200).json({
        success: true,
        data: updatedUser
    })
})

router.delete('/:id', (req, res)=>{
    const {id} = req.params;

    const user = users.find((each)=> each.id === id);

    if(!user)
    return res.status(404).json({success:false, message:"User does not exist"})

    const index = users.indexOf(user)

    users.splice(index, 1);
    return res.status(200).json({
        success: true,
        data: users
    })

})

router.get('/subscription-details/:id', (req,res)=>{
    const {id} = req.params;

    const user = users.find((each)=> each.id === id)

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User With The Given ID Does't Exist"
        })
    }

    const getDateInDays = (data ="")=>{
        let date = "";
        if(date === ""){
            date = new Date();
        }else{
            date = new Date(data);
        }
        let days = Math.floor(data / (1000 * 60 * 60 * 24));
        return days;
    };

    const subscriptionType = (date)=>{
        if(user.subscriptionType === "Basic"){
            date += 90;
        }else if(user.subscriptionType === "Standard"){
            date += 180;
        }else if(user.subscriptionType === "Premium"){
            date += 365;
        }
        return date;
    };

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionDate - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0,
    }

    res.status(200).json({
        success: true,
        data
    })
})



module.exports = router;
