export default function getTopicId(label, topicList) {
    const topicsJSON = JSON.parse(topicList);

    let topicValue;

    topicsJSON['arr'].forEach(topic => {
        if (topic.label === label) topicValue = topic.value;
    });

    return topicValue;
}