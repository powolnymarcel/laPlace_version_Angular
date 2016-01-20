var mongoose = require( 'mongoose' );
//---------------------------------------------------------------
/*                MODELE POUR UN ENDROIT                       */
/*                Ce document contient :                       */
/*         schéma de : commentaires,heures,l'endroit           */
//---------------------------------------------------------------
var heuresOuvertureSchema = new mongoose.Schema({
	jours: {type: String, required: true},
	ouverture: String,
	fermeture: String,
	ferme: {type: Boolean, required: true}
});

var commentairesSchema = new mongoose.Schema({
	auteur: {type: String, required: true},
	note: {type: Number, required: true, min: 0, max: 5},
	texte: {type: String, required: true},
	temps: {type: Date, "default": Date.now}
});

var endroitSchema = new mongoose.Schema({
		nom: {type: String, required: true},
		adresse: String,
		note: {type: Number, "default": 0, min: 0, max: 5},
		services: [String],
		coords: {type: [Number], index: '2dsphere'},
		heuresOuverture: [heuresOuvertureSchema],
		commentaires:[commentairesSchema]
});


mongoose.model('Endroit', endroitSchema);

//---------------------------------------------------------------------------
//                                                                         //
//                        EXEMPLE DATA DE CE MODELE                        //
//                                                                         //
//---------------------------------------------------------------------------
//	{
//		"_id": ObjectId("52e2f4ze9f79c444a86710fe7f5"),
//		"nom": "Delhaize",
//		"adresse": "Rue du commerce 33, 4630 Soumagne",
//		"note": 3,
//		"services": ["Pains frais", "Boissons", "Legumes"],
//		"coords": [-0.9690884, 51.455041],
//		"heuresOuverture": [{
//		"_id": ObjectId("e34ze39c44a86710fe7f6"),
//		"jours": "Lundi - Vendredi",
//		"ouverture": "7:00",
//		"fermeture": "19:00",
//		"ferme": false
//	}, {
//		"_id": ObjectId("52ef3a9f79c44a86710fe7f7"),
//		"jours": "Samedi",
//		"ouverture": "8:00",
//		"fermeture": "17:00",
//		"ferme": false
//	}, {
//		"_id": ObjectId("52ef3a9f79e1fz2e4r1c44a86710fe7f8"),
//		"jours": "Dimanche",
//		"ferme": true
//	}],
//		"commentaires": [{
//		"_id": ObjectId("52ef3a9f2df5e2r7fz9ef710fe7f9"),
//		"auteur": "Poma",
//		"note": 5,
//		"temps": ISODate("2016-01-16T23:00:00Z"),
//		"texte": "Magasin vide..."
//	}, {
//		"_id": ObjectId("52ef3a9f79c44a86710fe7fa"),
//			"auteur": "Marta",
//			"note": 3,
//			"temps": ISODate("2016-01-16T23:00:00Z"),
//			"texte": "Magasin ok...."
//	}]
//	}
