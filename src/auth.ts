import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { randomBytes } from 'crypto';

interface Payload extends JWTPayload {
	sub: string;
	iat: number;
	exp: number;
	iss: 'Epico-Backend';
	aud: 'Epico';
}

export class Auth {
	private static HMACToken = randomBytes(512);

	public static async createToken(username: string) {
		return await new SignJWT({
			sub: username
		})
			.setProtectedHeader({ alg: 'HS512' })
			.setIssuedAt()
			.setIssuer('Epico-Backend')
			.setAudience('Epico')
			.setExpirationTime('2h')
			.sign(this.HMACToken);
	}

	public static async parseToken(token: string) {
		try {
			return await jwtVerify(token, this.HMACToken, {
				issuer: 'Epico-Backend',
				audience: 'Epico'
			}).then(data => data.payload as Payload);
		} catch {
			return null;
		}
	}
}
