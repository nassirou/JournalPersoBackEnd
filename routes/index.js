
const express = require('express');
// const mongoose=require('mongoose');
const router = express.Router();


const Article = require('../model/articles.js')

router.get('/liste', (req, res) => {
    /*Article.find((err, data) => {
        if (err)
            console.log(err);
        res.send(data);
    })*/

    Article.find()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(404).send(console.log(err)))
})

router.get('/liste/:id', (req, res) => {
    /*var idElement=req.params.id;
    if (idElement.isValidObjectId)*/
    // var Oid=mongoose.
    Article.findById(req.params.id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(404).send(console.log('Données introuvables : ' + JSON.stringify(err, undefined, 2))))
})

router.post('/', (req, res) => {

    let article = new Article(
        {
            categorie: req.body.categorie,
            titre: req.body.titre,
            contenu: req.body.contenu
        }
    );

    // article.save(err=>res.send('Erreur '+err), data=>res.send(data));

    article.save()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(404).send(console.log('L\'insertion de l\'article a échoué...' + JSON.stringify(err, undefined, 2))))


})

router.delete('/liste/:id', (req, res) => {
    let idArticle = req.params.id;
    Article.findByIdAndDelete(idArticle)
        .then(res.status(200).send('Suppression réussie de l\'article d\'identifiant: ' + idArticle))
        .catch(err => res.status(404).send('Une erreur survenue durant la suppression de l\'article : ' + JSON.stringify(err)))
})

router.put('/liste/:id', (req, res) => {    // le signe slash (/) est indispensable pour le chemin du contrôleur

    let idArticle = req.params.id;

    let articleModifie = {
        categorie: req.body.categorie,
        titre: req.body.titre,
        contenu: req.body.contenu
    };
    Article.findByIdAndUpdate(idArticle, articleModifie) // ,(err,res)=>{}
        .then(data => res.status(200).send({
            message: "Modification réussie de l\'article d'identifiant id=" + idArticle
        })
        )
        .catch(err => {
            res.status(500).send({
                message: "Une erreur est survenue en tentant de modifier l\'article d'identifiant id=" + idArticle
            })
        })
})

/*router.route('/inscription').post((req,res)=>{
    res.send('module d\'inscription')
});
*/


module.exports = router;