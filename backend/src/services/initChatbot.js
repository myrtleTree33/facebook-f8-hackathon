import axios from 'axios';

const {
    PAGE_ACCESS_TOKEN
  } = process.env;

const makeGreeting = () =>{
    console.log('makeGreeting')

}

const makePersistantMenu = async () => {
    console.log("makePersistantMenu");
    try {
        await axios.post( 
            `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                "persistent_menu":[
                    {
                        "locale":"en_US",
                        "composer_input_disabled": true,
                        "call_to_actions":[
                            {
                                "type":"web_url",
                                "title": "go trapple rabbit",
                                "url":"http://blog.kebhana.com/990",
                                "webview_height_ratio": "tall"
                            },{
                                "type":"web_url",
                                "title": "test2",
                                "url":"http://blog.kebhana.com/990",
                                "webview_height_ratio": "tall"
                            },{
                                "type":"web_url",
                                "title": "test2",
                                "url":"http://blog.kebhana.com/990",
                                "webview_height_ratio": "tall"
                            }
                        ]
                    }
                ]
            },
        ).then(response => {
            console.log('response', response);
        });
    } catch (e) {
        console.log('error', e);
    }
}

const initBot = () =>{
    console.log("initBot");
    makeGreeting();
    makePersistantMenu();

}

export default initBot;
