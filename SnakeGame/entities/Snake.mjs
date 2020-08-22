const Snake = class{
  #x
  #y
  #name
  #velocity
  #speed
  #horizontal
  #cells
  #maxCells
  #color
  #brains
  #enabled
  #INITIAL
  constructor({x, y, velocity, horizontal=false, maxCells=2, brains, color, name=''}){
    this.#INITIAL = {x, y, velocity, horizontal, maxCells};
    this.#x = x;
    this.#y = y;
    this.#name = name;
    this.#velocity = velocity;
    this.#speed = Math.abs(this.velocity);
    this.#horizontal = horizontal;
    this.#cells = [];
    this.#maxCells = maxCells;
    this.#color = color;
    for(let i = 0; i < this.#maxCells; i++){
      if(horizontal){
        this.#cells.push({ x: x - i, y });
      } else {
        this.#cells.push({ x, y: y - i });
      }
    }
    this.#brains = brains;
    this.boundUpdateState = this.updateState.bind(this);
    this.enabled = true;
  }
  reset(){
    const {x, y, velocity, horizontal, maxCells} = this.#INITIAL;
    this.#x = x;
    this.#y = y;
    this.#velocity = velocity;
    this.#speed = Math.abs(this.velocity);
    this.#horizontal = horizontal;
    this.#cells = [];
    this.#maxCells = maxCells;
    if(!this.enabled){
      this.enabled = true;
    }
  }
  get name(){
    return this.#name;
  }
  get enabled() {
    return this.#enabled;
  }
  set enabled(detail) {
    this.#enabled = !!detail;
    if(detail){
      for(const brain of this.#brains) {
        brain.addEventListener('thought', this.boundUpdateState);
      }
    }else{
      for(const brain of this.#brains) {
        brain.removeEventListener('thought', this.boundUpdateState);
      }
    }
  }
  get color(){
    return this.#color;
  }
  get horizontal(){
    return this.#horizontal;
  }
  get velocity(){
    return this.#velocity;
  }
  get head(){
    return this.#cells[0];
  }
  get tail(){
    return this.#cells.slice(1);
  }
  get cells(){
    return this.#cells;
  }
  get x(){
    return this.#x;
  }
  get y(){
    return this.#y;
  }
  get direction(){
    if(this.#velocity > 0){
      if(this.#horizontal) {
        return 'right';
      }
      return 'down';
    }else{
      if(this.#horizontal) {
        return 'left';
      }
      return 'up';
    }
  }
  grow(size=1){
    this.#maxCells+=size;
  }
  move({width, height}) {
    // move snake by it's velocity
    if(this.#horizontal){
      this.#x += this.#velocity;
    }else{
      this.#y += this.#velocity;
    }
    // wrap snake position horizontally on edge of screen
    if (this.#x < 0) {
      this.#x = width - this.#speed;
    }
    else if (this.#x >= width) {
      this.#x = 0;
    }
    // wrap snake position vertically on edge of screen
    if (this.#y < 0) {
      this.#y = height - this.#speed;
    }
    else if (this.#y >= height) {
      this.#y = 0;
    }
    // keep track of where snake has been. front of the array is always the head
    this.#cells.unshift({x: this.x, y: this.y});
    // remove cells as we move away from them
    if (this.#cells.length > this.#maxCells) {
      this.#cells.pop();
    }
  }
  updateState({ detail: { which } }) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    switch(which){
      case 'left':
        if(!this.#horizontal) {
          this.#horizontal = true;
          if(this.#velocity > 0){
            this.#velocity *= -1;
          }
        }
      break;
      case 'up':
        if(this.#horizontal) {
          this.#horizontal = false;
          if(this.#velocity > 0){
            this.#velocity *= -1;
          }
        }
      break;
      case 'right': 
      if(!this.#horizontal) {
        this.#horizontal = true;
        if(this.#velocity < 0){
          this.#velocity *= -1;
        }
      }
      break;
      case 'down':
        if(this.#horizontal) {
          this.#horizontal = false;
          if(this.#velocity < 0){
            this.#velocity *= -1;
          }
        }
        break;
      case 'clockwise':
        switch(this.direction){
          case 'up':
            this.#horizontal = true;
            this.#velocity *= -1;
            break;
          case 'right':
            this.#horizontal = false;
            break;
          case 'down':
            this.#horizontal = true;
            this.#velocity *= -1;
          break;
          case 'left':
            this.#horizontal = false;
            break;
          default:
        }
        break;
      case 'counterclockwise':
        switch(this.direction){
          case 'up':
            this.#horizontal = true;
            break;
          case 'left':
            this.#horizontal = false;
            this.#velocity *= -1;
            break;
          case 'down':
            this.#horizontal = true;
          break;
          case 'right':
            this.#horizontal = false;
            this.#velocity *= -1;
            break;
          default:
        }
        break;
    }
  }
}
export default Snake;
