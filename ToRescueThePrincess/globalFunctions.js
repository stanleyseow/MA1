
////////////////////////////////////////////////////////
//
// access this function using updateInventory.call(this)
// Uses a JS function to prevent repeated codes
// 
///////////////////////////////////////////////////////
function updateInventory() {
    console.log("*** updateInventory()")
    // Emit events showInventory
    this.inventory = {}
    this.inventory.heart = window.heart
    this.inventory.key = window.key
    this.inventory.knife = window.knife

  
    console.log('*** updateInventory() Emit event', this.inventory)
    this.invEvent = (event, data) =>  { this.scene.get('showInventory').events.emit(event, data); }
    this.invEvent("inventory", this.inventory);
  }
  
  ////////////////////////////////////////////////////////
  //
  // access this function using guardCaught
  // Uses a JS function to prevent repeated codes
  // 
  ///////////////////////////////////////////////////////
  function guardCaught(player,guard) {
      console.log("*** player hit guard");
  
      this.hitSnd.play();
  
      // Shake screen
    this.cameras.main.shake(150);
  
      window.heart--
      guard.disableBody(false, true);
      //this.updateInventory()
      updateInventory.call(this)
  
    if (window.heart == 0){
      this.scene.start("gameOver");
      this.loseSnd.play();
    }
  }

  function killGuard(knife,guard) {
    console.log("*** knife hit guard");

    this.hitSnd.play();

    // Shake screen
    this.cameras.main.shake(150);

    guard.disableBody(false, true);
    //knife.disableBody(false, true);
    //this.updateInventory()
    updateInventory.call(this)

}

function collectKnife(player, knife) {
  console.log("*** collect knife");

  //this.smallHitSnd.play();
  window.knife++

  knife.disableBody(true, true);

  //this.updateInventory()
  updateInventory.call(this)

}
