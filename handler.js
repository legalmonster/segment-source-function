// 1. Access your event body, headers and query parameters through the event object
// 2. Transform the event into Segment Tracking Events or Objects by returning an object with the appropriate keys

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;
  let marketingConsentState = false;
  let identifier = null;

  if (eventBody.consent.document.document_category.slug === "email_marketing") {

    if (eventBody.consent.state === "active"){
      marketingConsentState = true
    }

    if (eventBody.consent.user.identifier === null){
      if(eventBody.consent.user.email !== null){
        identifier = eventBody.consent.user.email;
      }
    } else {
      identifier = eventBody.consent.user.identifier;
    }


    // Return an object with any combination of the following keys
    let returnValue = {
      events: [{
          type: 'identify',
          userId: identifier,
          traits: {
            marketingConsent: marketingConsentState,
            name: eventBody.consent.user.name,
            email: eventBody.consent.user.email
          }
      },
      {
          type: 'track',
          event: eventBody.event_name,
          userId: identifier,
          properties: {
            marketingConsent: marketingConsentState
          }
      }],
      objects: [{
        collection: 'Consents',
        id: eventBody.consent.public_key,
        properties: {
        }
      }]
    }

    // Return the Javascript object with a key of events, objects or both
    return returnValue;

  } else {
    return null;
  }
}
