export  function generateRandomId(): number {
    return Math.floor(1000000 + Math.random() * 9000000);
  }

export function generateRandomRecepiId():number{
    return Math.floor(100000000+Math.random()*999999999)
}