module.exports = function (conf) {
	
	conf = conf || {};

	if (!conf.width) {
		conf.width = 100;
	}
	
	if (!conf.font) {
		conf.font = "bariol";
	}
	
	if(!conf.fontSize){
		conf.fontSize = 68;
	}

	if (!conf.color) {
		conf.color = "#3214FF";
	}
	
	if (!conf.fontColor) {
		conf.fontColor = "#FFFFFF";
	}
	
	if (!conf.text) {
		conf.text = "I.E.";
	}

	if (!conf.shape || ['square', 'circle'].indexOf(conf.shape) === -1) {
		conf.shape = 'square';
	}
	
	
	return conf;
};
