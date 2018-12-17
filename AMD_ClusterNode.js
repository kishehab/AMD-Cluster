      define([['dojo/_base/declare']],function(declare){
            return declare(null,{
                // setup global variables
                svgNS: null,
                svg: null,
                singles: null, 
                height:null, 
                width:null,
                constructor: function(singles, height, width){
                    svgNS = document.createElementNS("http://www.w3.org/2000/svg", "svg").namespaceURI;
                    this.singles = singles;
                    this.height = height;
                    this.width = width;
                },

                classifySingles: function(singles, propertyKey){
                    var classification = {};
                    for(var i=0; i<singles.length; i++){
                        for(var key in singles[i]){
                          if( key === propertyKey && classification[singles[i][key]] === undefined){
                                classification[singles[i][key]] = 1;
                          } else if(key === propertyKey) {
                                classification[singles[i][key]]++;
                          }
                        }
                    }
                //console.log(classification);
                return classification;
            },
            assignSize: function(counting, cnt){
                var countNumbers = Object.values(counting);
                var largest, smallest;

                largest = Math.max.apply(null, countNumbers);
                smallest = Math.min.apply(null, countNumbers);
                if(cnt >= largest){
                    return 'XLarge';
                }
                if(cnt <= smallest){
                    return 'small';
                }
                if(cnt < largest && cnt >smallest){
                    return 'medium';
                }
            },

            setupClusterCircles:function(classificationObjects){
                var clusterCircles = [];
                var sizes = ['XLarge','large','medium','small'];

                for(var k in classificationObjects){
                    clusterCircles.push({
                        'type': k,
                        'count': classificationObjects[k],
                        'size': assignSize(classificationObjects,classificationObjects[k])
                    });
                }
                return clusterCircles;
            },

            positioning:function(postion, x, y, m, r) {
                switch (postion) {
                    case 0:
                        return {x: x + m + r, y: y - m - r};
                    case 1:
                        return {x: x - m - r, y: y - m - r};
                    case 2:
                        return {x: x - m - r, y: y + m + r};
                    case 3:
                        return {x: x + m + r, y: y + m + r};
                    default:
                        return {x: x , y: r};
                }
            },

            createClusterNode:function(){
                this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', this.width);
                svg.setAttribute('height', this.height);

                var orginX = this.width/2;
                var orginY = this.height/2;

                var motherCircleRadius = this.height/10;
                var margin = this.height/15;

                var radiusSize = {'XLarge': (this.height/2)*0.42 , 'large': (this.height/2)*0.39, 'medium':(this.height/2)*0.35,'small':(this.height/2)*0.30};
                var colorType = {'fieldService': '#f2b318', 'inspection': '#4480ac', 'maintinance': '#92b264','wellServices':'#e8355c'};

                var motherCircle  = new Circle(orginX,orginY,motherCircleRadius, '', '');
                var circles = [];

                var clusterCircleProperties = setupClusterCircles(classifySingles(singles, 'jobType'));
                for (var i = clusterCircleProperties.length - 1; i >= 0; i--) {
                    circles.push( new Circle(   positioning(i,orginX,orginY,margin,radiusSize[clusterCircleProperties[i].size]).x, 
                                                positioning(i,orginX,orginY,margin,radiusSize[clusterCircleProperties[i].size]).y,
                                                radiusSize[clusterCircleProperties[i].size],
                                                colorType[clusterCircleProperties[i].type],
                                                clusterCircleProperties[i].count ));
                }

                svg.appendChild(motherCircle.getCircleNode());

                for (var m = circles.length - 1; m >= 0; m--) {
                     circles[m].setTextSize(this.height/5);
                     svg.appendChild(circles[m].getCircleNode());
                     svg.appendChild(circles[m].connectToMother(motherCircle));
                     console.log(circles[m]);
                }
                return svg;
                }
            });
        });  