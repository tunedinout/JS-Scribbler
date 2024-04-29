export async function sendAuthCode(authCode) {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authCode }),
        })
        const res = await response.json()
        console.log(res)
        return res;
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to send access token',
        }
    }
}
