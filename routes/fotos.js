var express = require('express');
var router = express.Router();
module.exports = router;

const { Sequelize, Op } = require('sequelize');
const Foto = require('../models').foto;
const Etiqueta = require('../models').etiqueta;

router.get('/findAll/json', async function(req, res, next) {
  try {
    const fotos = await Foto.findAll({
      attributes: { exclude: ["updatedAt"] },
      include: [{
        model: Etiqueta,
        as: 'etiquetas',
        attributes: ['texto'],
        through: { attributes: [] }
      }]
    });
    res.json(fotos);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/findAll/view', async function(req, res, next) {
  try {
    const fotos = await Foto.findAll({
      attributes: { exclude: ["updatedAt"] },
      include: [{
        model: Etiqueta,
        as: 'etiquetas',
        attributes: ['texto'],
        through: { attributes: [] }
      }]
    });
    res.render('fotos', { title: 'Fotos', arrFotos: fotos });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/findAllByRate/json', function(req, res, next) {
  let lower = parseFloat(req.query.lower);
  let higher = parseFloat(req.query.higher);

  Foto.findAll({
    attributes: { exclude: ["updatedAt"] },
    include: [{
      model: Etiqueta,
      as: 'etiquetas',
      attributes: ['texto'],
      through: { attributes: [] }
    }],
    where: {
      calificacion: {
        [Op.between]: [lower, higher]
      }
    }
  })
  .then(fotos => {
    res.json(fotos);
  })
  .catch(error => {
    res.status(400).send(error);
  });
});

router.get('/findAllById/:id/json', function(req, res, next) {
  let id = parseInt(req.params.id);

  Foto.findAll({
    attributes: { exclude: ["updatedAt"] },
    include: [{
      model: Etiqueta,
      as: 'etiquetas',
      attributes: ['texto'],
      through: { attributes: [] }
    }],
    where: {
      [Op.and]: [
        { id: id }
      ]
    }
  })
  .then(fotos => {
    if (fotos.length > 0) {
      const fotosFormatted = fotos.map(foto => ({
        id: foto.id,
        titulo: foto.titulo,
        descripcion: foto.descripcion,
        calificacion: foto.calificacion,
        ruta: foto.ruta,
        createdAt: foto.createdAt,
        etiqueta: foto.etiquetas.map(etiqueta => ({ texto: etiqueta.texto }))
      }));
      res.json(fotosFormatted);
    } else {
      res.status(404).send({ message: "Foto no encontrada" });
    }
  })
  .catch(error => {
    res.status(400).send(error);
  });
});

router.get('/findAllById/:id/view', function(req, res, next) {
  let id = parseInt(req.params.id);

  Foto.findOne({
    attributes: { exclude: ["updatedAt"] },
    include: [{
      model: Etiqueta,
      as: 'etiquetas',
      attributes: ['texto'],
      through: { attributes: [] }
    }],
    where: {
      id: id
    }
  })
  .then(foto => {
    if (foto) {
      const fotoFormatted = {
        id: foto.id,
        titulo: foto.titulo,
        descripcion: foto.descripcion,
        calificacion: foto.calificacion,
        ruta: foto.ruta,
        createdAt: foto.createdAt,
        etiqueta: foto.etiquetas.map(etiqueta => ({ texto: etiqueta.texto }))
      };
      res.render('fotoDetalle', { title: 'Detalle de Foto', foto: fotoFormatted });
    } else {
      res.status(404).send({ message: "Foto no encontrada" });
    }
  })
  .catch(error => {
    res.status(400).send(error);
  });
});
