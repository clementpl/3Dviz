var histo3D = require('./histogram3D');

function main() {
  var histo = new histo3D('viz',);
  var dataExample1 = [
            //x1 month, x2.., y value
            {"month": "january", "value": 5},
            {"month": "february","value": 10},
            {"month": "march","value": 13},
            {"month": "april","value": 19},
            {"month": "may","value": 21},
            {"month": "june","value": 25},
            {"month": "july","value": 22},
            {"month": "august","value": 18},
            {"month": "september","value": 15},
            {"month": "october","value": 13},
            {"month": "november","value": 11},
            {"month": "december","value": 12}
      ];
  var getterExample1 = {x:"month", y:"value"}

  var dataHouse = [
    {"nbPiece": 1, "m2": 40, "price": 20000},
    {"nbPiece": 1, "m2": 60, "price": 27500},
    {"nbPiece": 1, "m2": 20, "price": 10000},
    {"nbPiece": 2, "m2": 45, "price": 30000},
    {"nbPiece": 2, "m2": 35, "price": 20000},
    {"nbPiece": 3, "m2": 50, "price": 35000},
  ];
  var getterHouse = {x:"nbPiece", y:"price", z:"m2"};

//  histo.load(dataHouse, getterHouse);
  histo.load(dataExample1, getterExample1);
  histo.render();
}

main();
