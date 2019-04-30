import axios from 'axios';

const {
    PAGE_ACCESS_TOKEN
  } = process.env;

const makeGreeting = () =>{
    // console.log('makeGreeting')
    try {
        await axios.post( 
            `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                "greeting":[
                    {
                        "locale":"default",
                        "text":"hello.{{user_full_name}}!!! we are travelyay"
                    }
                ],
               
             },
        ).then(response => {
            if(response.statusCode == 200){
                console.log('we make greeting');
            }
        });
    } catch (e) {
        console.log('error in greeting', e);
    }
}

const makePersistantMenu = async () => {
    // console.log("makePersistantMenu");
    try {
        await axios.post( 
            `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                "persistent_menu":[
                    {
                        "locale":"default",
                        "composer_input_disabled": false,
                        "call_to_actions":[
                            {
                                "type":"web_url",
                                "title": "go trapple rabbit",
                                "url":"http://www.naver.com",
                                "webview_height_ratio": "tall"
                            },{
                                "type":"web_url",
                                "title": "what is travelyay",
                                "url":"http://www.naver.com",
                                "webview_height_ratio": "tall"
                            },{
                                "type":"web_url",
                                "title": "contact us!!!",
                                "url":"http://www.naver.com",
                                "webview_height_ratio": "tall"
                            }
                        ]
                    }
                ]
            },
        ).then(response => {
            if(response.statusCode == 200){
                console.log('we make persistent menu');
            }
        });
    } catch (e) {
        console.log('error in makePersistantMenu', e);
    }
}

const initBot = () =>{
    makeGreeting();
    makePersistantMenu();

}

export default initBot;
