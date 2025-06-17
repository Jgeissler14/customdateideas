import { Configuration, OpenAIApi } from 'openai';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { age, location, interests, personalDescription } = body;
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    const prompt = `Generate 4 fun date ideas for a ${age} year old in ${location}. Interests: ${interests.join(', ')}. About them: ${personalDescription}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const ideas = completion.data.choices[0]?.message?.content ?? '';
    return { statusCode: 200, body: ideas };
  } catch (err) {
    return { statusCode: 500, body: 'Failed to generate ideas' };
  }
};
