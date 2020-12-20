
const mongoose = require('mongoose');
// mongoose.model('')

const schemaArticle = mongoose.Schema({
    // id: ObjectId,
    //_id: mongoose.ObjectId, INUTILE DE PRECISER CE TYPE QUI EST AUTO-GENERE EN ARRIERE-PLAN ET TRANSMIS VERS FRONT-END PAR MONGOOSE: 
    categorie: String,
    titre: String,
    contenu: String,
    // dateCreation: Date
    createdAt: Date

}
    , { timestamps: true } //
)

/* const Article = mongoose.model('Article', schemaArticle);
module.exports = Article; 
*/


module.exports = mongoose.model('Article', schemaArticle);