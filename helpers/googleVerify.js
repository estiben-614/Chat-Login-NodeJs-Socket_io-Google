//Verificar Token Google
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOODLECLIENT_ID);
export async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOODLECLIENT_ID, 
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  
  //Devuelve el token decodificado 
  return payload
}
