function extractHashtags(sentence) {
    const regex = /#[^\s#]*/g; // Regular expression to match hashtags (words starting with '#')
    const hashtags = sentence.match(regex) || []; // Extract hashtags from the sentence
    return hashtags;
}
module.exports = extractHashtags