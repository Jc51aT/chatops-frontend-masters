import { type Handler, schedule } from "@netlify/functions";
import { getNewItems } from "./util/notion";
import { blocks, slackApi } from "./util/slack";

const postnewNotionItemsToSlack: Handler =async () => {
    const items = await getNewItems();

    await slackApi('chat.postMessage', {
        channel: 'C05SL27HEG3',
        blocks: [
            blocks.section({
                text: [
                    'Here are the opinions awaiting judgement:',
                    '',
                    ...items.map(
                        (item) => `- ${item.opinion} (spice level: ${item.spiceLevel})`,
                    ),
                    '',
                    `see all items:  <https://notion.com/${process.env.NOTION_DATABASE_ID}`
                ].join('\n')
            })
        ]
    })

    return { 
        statusCode: 200
    };
}

// export const handler = schedule('0 9 * * 1', postnewNotionItemsToSlack)
export const handler = schedule('* * * * *', postnewNotionItemsToSlack)