var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  var template = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	var partialsDir = path.join(__dirname, 'partials');
  
  var filenames = fs.readdirSync(partialsDir);
  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
	  if (!matches) {
      return;
	  }
	  var name = matches[1];
	  var filepath = path.join(partialsDir, filename)
	  var template = fs.readFileSync(filepath, 'utf8');
    
	  Handlebars.registerPartial(name, template);
	});

	Handlebars.registerHelper('eq', function (value1, value2) {
		return value1 === value2;
	});
  
	// Nicer dates
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	Handlebars.registerHelper('date', function(date) {
	const dateArr = date.split('-');
    const theDate = new Date(dateArr[0], parseInt(dateArr[1])-1);
	  return `${months[theDate.getMonth()]} ${theDate.getFullYear()}`;
	});

	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

Handlebars.registerHelper('paragraphSplit', function(plaintext) {
    var i, output = '',
        lines = plaintext.split(/\r\n|\r|\n/g);
    for (i = 0; i < lines.length; i++) {
        if(lines[i]) {
            output += '<p>' + lines[i] + '</p>';
        }
    }
    return new Handlebars.SafeString(output);
});

module.exports = {
	render: render
};
