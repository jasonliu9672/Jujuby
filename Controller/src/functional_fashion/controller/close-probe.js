export default function makeInitiateProbe({deleteProbe}){
    return async function initiateProbe(httpRequest) {
        try{
            const probeId = httpRequest.params.id 
            const isClosed = await deleteProbe(probeId)
            return {
                headers:{
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                },
                statusCode: isClosed ? 202 : 404,
                body: { status: true }
            }
        }
        catch (e) {
            console.log(e)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 400,
              body: {
                status: false,
                error: e.message
              }
            }
        }
    }
}