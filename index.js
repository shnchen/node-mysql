var userInput = process.argv[process.argv.length-1]
console.log(process.argv);
var random = Math.random()*3 //产生一个0-3之间的随机数
let computerAction;
if( random < 1 ){
    computerAction = '石头'
} else if( random < 2) {
    computerAction = '剪刀'
} else {
    computerAction = '布'
}
console.log('系统出牌为：',computerAction)
if(userInput==computerAction){
    console.log('平局')
}else if(
    (userInput=='石头'&&computerAction=='剪刀') ||
    (userInput=='剪刀'&&computerAction=='布') ||
    (userInput=='布'&&computerAction=='石头')
) {
// 玩家赢了
    console.log('玩家赢了')
} else {
    // 玩家输了
    console.log('玩家输了')
}
