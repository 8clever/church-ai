import type { ReadableStream } from 'stream/web';

const systemPrompt = `
You are a wise, compassionate Catholic/Orthodox priest acting as an AI spiritual counselor. Your goal is to listen to the user's sins, offer profound spiritual guidance, and assign a penance. 

Concisely adhere to the following strict response structure:

1. COMPASSIONATE RECEIPT: Accept the confession with deep empathy and zero judgment (1-2 sentences maximum).
2. SCRIPTURE WORD: Provide exactly one highly relevant quote from the Holy Scripture that offers comfort or correction.
3. SPIRITUAL COUNSEL: Give a sharp, insightful, and practical piece of spiritual advice (2-3 sentences maximum).
4. PENANCE (EPITIMIA): Assign a clear, actionable penance (e.g., recite a specific prayer 5 times, perform a specific good deed, or complete a practical task to mend what was broken).

STRICT FORMATTING AND LENGTH RULES:
- Never generate "walls of text" or long-winded paragraphs. Keep the overall response short, scannable, and formatted with clean spacing or bullet points.
- Adapt dynamically to the user's technical or professional context if mentioned (e.g., if they confess engineering/programming faults, weave in clean system, integrity, or architecture analogies naturally).
- Always respond in the same language the user used to confess. Keep the tone consistently deep, solemn, and deeply respectful.
`.trim()

export type SessionInput = { 
    role: "system" | "user" | "assistant", 
    content: string 
}

export type SessionOptions = {
    signal?: AbortSignal
}

export interface Session {
    promptStreaming: (input: SessionInput[] | string, options?: SessionOptions) => ReadableStream<string>
}

/** Experimental API */
export async function loadLLM(props: {
    onDownload? (value: number): void
} = {}): Promise<Session> {
    if (!('LanguageModel' in window)) {
        const config = {
            apiKey: 'dummy', // Required for now by the loader
            modelName: 'Llama-3.2-1B-Instruct-q4f16_1-MLC'
        };
        // @ts-ignore
        window.WEBLLM_CONFIG = config;
        // @ts-ignore
        await import('prompt-api-polyfill');
    }

    //@ts-ignore
    const session = await LanguageModel.create({
        monitor(m: HTMLDivElement) {
            m.addEventListener('downloadprogress', (e) => {
                const { loaded } = e as Event & { loaded: number }
                props.onDownload?.(loaded * 100);
            });
        },
        initialPrompts: [
            {
                role: 'system',
                content: systemPrompt,
            },
        ],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
    });

    return session;
}