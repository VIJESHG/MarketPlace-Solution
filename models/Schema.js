const mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User  = new Schema({
	id  : ObjectId,
	username : String ,
	password : String
})

var Aadhar = new Schema({
  id  : ObjectId,
  aadharID : String,
  Name:String,
  Street : String ,
  DOB: String,
  Gender : String,
  Mobile : String,
  City:String,
  Pincode : String,
})

var Issue = new Schema({
	id : ObjectId,
	projID : String,
	title : String,
	description : String,
	token : String,
	username : String,
	status : Boolean,
	openTimeStamp : String,
	closedTimeStamp : String,
	warnings : Number,
	hash: String,
})

var NGODarpan = new Schema({
  id  : ObjectId,
  City : String,
  Name:String,
  Sectors : String,
  State: String,
  ID : String
})

var Person = new Schema({
  id  : ObjectId,
  username : { type : String , unique : true },
  password : String ,
	Name: String,
  email : { type : String , unique : true } ,
  Street : String ,
  DOB: String,
  Gender : String,
  Pincode : String,
  Phone : String,
	credits : Number,
	volunteer_in : [{projID: String , hash:String}],
	projects : [String],
  Donations : [String],
	blockFlag : Boolean,
	timestamp:String,
  recommends:[String],
	recommended_by : [String],
	signupHash : String
})

var Volunteer = new Schema({
  id  : ObjectId,
  username : String,
  projID: String,
  timestamp:String,
	signupHash : String
})

var Recommendation = new Schema({
  id  : ObjectId,
  from : String,
	to: String,
	description : String,
  timestamp:String,
	hash : String,
	type: String
})

var Ngo = new Schema({
  id  : ObjectId,
	username : String,
	Name:String,
	Sector :  String,
	ngodarpanid : {type: String , unique:true},
	State: String,
	City: String,
	Type: String,
  Email:String,
	funds : Number,
	paymentaddress : String,
  timestamp : String,
	projects : [String],
  Credits:{type:Number, default:0},
	open_projects : {type:Number, default:0},
	closed_successful_projects : {type:Number, default: 0},
	total_projects : {type:Number, default: 0},
	recommends:[String],
	recommended_by : [String],
	signupHash : String,
	transactionHash : String
})

var Project = new Schema({
	id  : ObjectId,
	projId : {type:String, unique:true},
	orgId : String,
	title : String,
	description : String,
	tags : String,
  location : String,
	volunteers : [{username:String, hash : String}], //[volList : hash
	donations : [String],
	activities : [String], //Arr : ActivityHash cost description images
	volunteers_needed  : Number,
	funds_needed : Number,
	reqClose : Boolean,
 	reqCloseTimestamp : String,
	status : String,
  proj_hash : String,
	tranhash:String,
  bills : [String],
	admin:String,
	timestamp : String
})

var Activity = new Schema({
	id  : ObjectId,
  actID: {type : String, unique:true},
	title : String,
	description : String,
 	timestamp_of_creation : String,
  projID: String
 	// images to be added later.
})

var Bill = new Schema({
  id  : ObjectId,
	projID : String,
	title : String,
  billID:{type : String, unique:true},
	description : String,
 	timestamp_of_creation : String,
  amount: Number,
	tranhash : String
})

var User = new Schema({
    id  : ObjectId,
    username : {type : String, unique:true},
    password : String
})

var Donation = new Schema({
	id  : ObjectId,
	donorid : String,
	paymentaddress : String,
  projID:String,
	projTitle : String ,
  orgID:String,
	amount : Number,
	paymentid : {type : String,unique:true},
	transaction_hash : String,
	timestamp : String
})

var RequestVolunteer = new Schema({
	id  : ObjectId,
	projID : String,
	projtitle : String,
	person_username : String,
	status : String,
	timestamp : String,
	signupHash:String
})

var Test = new Schema({
 img:  { data: Buffer, contentType: String },
 name : String
})

/*
var Company = mongoose.model( 'Company' , new Schema({
	id  : String,
	name : { type : String , unique : true },
	password : String ,
	address : String ,
	contact : String ,
	type : String ,
	projects_donated_in : [String],
	// Reputation :
	// blockFlag :
	// Issues against
	transactionId : {type: String , default: '####'}
}))
*/
var Admin = new Schema({
	id: ObjectId,
	adminid : String,
	email : String,
  timestamp : String,
	open_projects : Number
})

var AdminProject = new Schema({
	id  : ObjectId,
	adminid : String,
	projID:String,
	timestamp : String
})

module.exports = {Recommendation:Recommendation,
	Person : Person,
	Aadhar:Aadhar,
	Ngo:Ngo,
	NGODarpan:NGODarpan,
	User:User,
	Bill:Bill,
	Project:Project,
	Activity:Activity,
	Volunteer:Volunteer,
	Donation:Donation,
	Admin:Admin,
	AdminProject:AdminProject,
	RequestVolunteer : RequestVolunteer,
	Issue:Issue,
	Test:Test
};
