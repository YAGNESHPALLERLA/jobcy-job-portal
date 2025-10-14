const { Schema, model } = require('mongoose');
       
const NewsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('News', NewsSchema);