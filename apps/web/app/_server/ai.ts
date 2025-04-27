'use server'

const MAKE_WEBHOOK_URL = process.env.WEB_MAKE_WEBHOOK_URL

export const sendMessage = async ({
  message,
  username,
  id,
}: {
  message: string
  username: string
  id: string
}) => {
  if (!MAKE_WEBHOOK_URL) {
    return {
      error: 'Webhook URL is not defined',
    }
  }

  if (!message.trim() || !username || !id) {
    return {
      error: 'Message, userName, and id are required',
    }
  }

  try {
    const payload = {
      message: message,
      name: username,
      id: id,
    }

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // Process the response
    const responseText = await response.text()

    const responseData = JSON.parse(responseText)
    const aiResponse =
      responseData.response || responseData.message || responseText

    return {
      success: true,
      data: aiResponse,
    }
  } catch (error) {
    console.error(
      'Unexpected error occurred on sendMessage server action:',
      error
    )
    return {
      error: 'An error occurred while sending the message',
    }
  }
}
