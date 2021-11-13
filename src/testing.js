// const { exec } = require("child_process");
//
// exec("git config --global --list", (error, stdout, stderr) => {
// // exec("echo> trying.js", (error, stdout, stderr) => {
// 	if (error) {
// 		console.log(`error: ${error.message}`);
// 		return;
// 	}
// 	if (stderr) {
// 		console.log(`stderr: ${stderr}`);
// 		return;
// 	}
// 	console.log(`stdout: ${stdout}`);
// });
let select = "okey"
const test = (select)=> {
	// console.log(`dokku ps:report ${select && select}`)
	// const option = select ? select : "--all"
	let parallel = true,cpu=1
	let option = parallel === true && cpu ? `--parallel ${cpu}` : ""
	console.log(`dokku ps:report ${option}`)
}
test("react")
// const { promisify } = require('util');
// const {exec} = require('child_process')
// const {getGitUser} = require("./testing");
// let execute = promisify(exec)
//
//  async function getGitUser () {
// 	// Exec output contains both stderr and stdout outputs
// 	const nameOutput = execute('git config --global user.name')
// 	const emailOutput = execute('git config --global user.email')
//
// 	return {
// 		name: nameOutput.stdout.trim(),
// 		email: emailOutput.stdout.trim()
// 	}
// };
//
//  getGitUser().then((res)=>console.log(res)).catch((err)=>console.log(err))