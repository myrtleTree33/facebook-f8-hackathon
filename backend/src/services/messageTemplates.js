import axios from 'axios';
const {
    PAGE_ACCESS_TOKEN
} = process.env;


const processGeneric = async (event) =>{
    console.log('********************');
    console.log("quickReply test")
    console.log('event', JSON.stringify(event, null, 2))
    console.log('********************');

    const text = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"generic",
                "elements":[
                    {
                        "title":"Welcome!",
                        "image_url":"https://petersfancybrownhats.com/company_image.png",
                        "subtitle":"We have the right hat for everyone.",
                        "default_action": {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com/view?item=103",
                        "webview_height_ratio": "tall",
                        },
                        "buttons":[
                        {
                            "type":"web_url",
                            "url":"https://petersfancybrownhats.com",
                            "title":"View Website"
                        },{
                            "type":"postback",
                            "title":"Start Chatting",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD"
                        }]      
                    }
                ]
            } 
        } 
    }   

  
    try {
        await axios.post(
            `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                messaging_type: 'RESPONSE',
                recipient: {
                    id: event.sender.id
                },
                message: {
                    
                    "attachment":{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements":[
                                {
                                    "title":"Welcome!",
                                    "image_url":"https://petersfancybrownhats.com/company_image.png",
                                    "subtitle":"We have the right hat for everyone.",
                                    "default_action": {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com/view?item=103",
                                    "webview_height_ratio": "tall",
                                    },
                                    "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://petersfancybrownhats.com",
                                        "title":"View Website"
                                    },{
                                        "type":"postback",
                                        "title":"Start Chatting",
                                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                    }]      
                                }
                            ]
                        } 
                    } 
                }
                
            }
        )
    } catch (e) {
        console.log('error in quickReply', e);
    }
    
}



export default processGeneric;





// import axios from 'axios';

// const generic = (event) =>{

//     console.log('********************');
//     console.log("RECEIVED POSTBACK IT WORKS");
//     console.log("payload", event.postback.payload);
//     console.log('********************');
// }

// export default generic;
