const messageTemplates = (event) =>{

    console.log('********************');
    console.log("RECEIVED POSTBACK IT WORKS");
    console.log("payload", event.postback.payload);
    console.log('********************');
}

export default messageTemplates;
