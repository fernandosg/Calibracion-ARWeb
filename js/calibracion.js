function Calibracion(){

}

Calibracion.prototype.start=function(){
  calibrar=false;
  calibracion_correcta=false;
  puntos_encontrados=false;
  primera_ejecucion=true;
  document.getElementById("calibrar").addEventListener("click",function(){
    if(!calibrar){
      this.inicioCalibracion();
      calibrar=true;
    }
  }.bind(this))
  this.pos_elegido=0;
  this.cantidad_cartas=4;// cantidad cartas
  this.cantidad_cartas_encontradas=0;
  this.initMemorama=false;
}

Calibracion.prototype.logicaCalibracion=function(puntero){

  if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
    puntero.visible=true;
    framework.individualDispatch("colision",framework.getObject(this.pos_elegido),[puntero.getWorldPosition()],function(esColisionado){
      if(esColisionado){
        framework.removeWatch("colision",framework.getObject(this.pos_elegido));
        this.pos_elegido++;
        if(this.pos_elegido==this.cantidad_cartas){
          this.puntos_encontrados=true;
          this.detener_calibracion=true;
          framework.finishStage();
        }else
          document.getElementById("colorSelect").style.backgroundColor=this.colores[this.pos_elegido];
      }
    });//*/
  }
}

Calibracion.prototype.inicioCalibracion=function(){
  var threshold_total=0;
  var threshold_conteo=0;
  for(var i=0;i<300;i++){
    framework.changeThreshold(i);//this.detector_ar.cambiarThreshold(i);
    if(framework.canDetectMarker(this)){//if(this.detector_ar.detectMarker(this)){
      threshold_total+=i;
      threshold_conteo++;
    }
  }
  if(threshold_conteo>0){
    threshold_total=threshold_total/threshold_conteo;
    framework.changeThreshold(threshold_total);//this.detector_ar.cambiarThreshold(threshold_total);
    calibracion_correcta=true;
    threshold_conteo=0;
    threshold_total=0;
  }
  calibrar=false;
  if(calibracion_correcta){
    framework.allowDetect(true);//this.allowDetect(true);
    this.colores=["rgb(34, 208, 6)","rgb(25, 11, 228)","rgb(244, 6, 6)","rgb(244, 232, 6)"];
    document.getElementById("colorSelect").style.backgroundColor=this.colores[this.pos_elegido];
    //CREACION DE OBJETOS A SELECCIONAR PARA CALIBRAR
    limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
    tamano_elemento=80;
    margenes_espacio=(framework.getWidth()-(tamano_elemento*limite_renglon))/limite_renglon;
    for(var x=1,pos_y=-100,fila_pos=x,pos_x=-200;x<=this.cantidad_cartas;x++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+margenes_espacio+tamano_elemento))){
      var geometry=new THREE.PlaneGeometry(tamano_elemento,tamano_elemento);
      var elemento=framework.createElement({WIDTH:tamano_elemento,HEIGHT:tamano_elemento,GEOMETRY:geometry});
      elemento.init();
      elemento.label(this.colores[x-1]);
      elemento.position({x:pos_x,y:pos_y,z:-600});
      elemento.defineSurfaceByColor(this.colores[x-1]);
      framework.addToScene(elemento).watch("colision",framework.position_util.isColliding);
    }
    var geometry=new THREE.PlaneGeometry(60,60);
    var mano_obj=framework.createElement({WIDTH:60,HEIGHT:60,GEOMETRY:geometry});
    mano_obj.init();
    mano_obj.defineSurfaceByResource("./assets/img/mano.png");
    this.puntero=new THREE.Object3D();
    this.puntero.add(mano_obj.get());
    this.puntero.position.z=-1;
    this.puntero.matrixAutoUpdate = false;
    this.puntero.visible=false;
    framework.addMarker({id:16,callback:this.logicaCalibracion,puntero:this.puntero});
  }
}

Calibracion.prototype.loop=function(){

}
