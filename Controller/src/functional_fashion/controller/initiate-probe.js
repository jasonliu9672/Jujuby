export default function makeInitiateProbe({addProbe}){
    return async function initiateProbe(httpRequest) {
        try{
            const {...probeInfo} = httpRequest.body 
            console.log(httpRequest)
            const initiated = await addProbe({
                ...probeInfo
            })
            return {
                headers:{
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                },
                statusCode: 201,
                body: {status: true, probe: {...initiated}}
            }
        }
        catch (e) {
            console.log(e.message)
            return {
              headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
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