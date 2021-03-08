// escape characters so they don't blow the XML up!
module.exports = (text) => {
    return String(text).replace(/(['"<>&'])(\w+;)?/g, (match, char, escaped) => {
        if(escaped) {
            return match
        }
        switch(char) {
            case "'": return '&quot;'
            case '"': return '&apos;'
            case "<": return '&lt;'
            case ">": return '&gt;'
            case "&": return '&amp;'
        }
    })

}