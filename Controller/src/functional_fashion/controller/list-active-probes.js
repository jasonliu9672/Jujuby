export default function makeListActiveProbe({listProbes}){
    return async function listActiveProbes(httpRequest) {
        try{
            const probeList = await listProbes()
            return {
                headers:{
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET, OPTIONS"
                },
                statusCode: 200,
                body: { status: true, probeList: probeList }
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