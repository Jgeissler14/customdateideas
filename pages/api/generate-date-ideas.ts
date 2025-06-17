import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { age, location, interests, personalDescription } = req.body;
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    const prompt = `Generate 4 fun date ideas for a ${age} year old in ${location}. Interests: ${interests.join(', ')}. About them: ${personalDescription}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const ideas = completion.data.choices[0]?.message?.content ?? '';
    res.status(200).json(JSON.parse(ideas));
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
}
