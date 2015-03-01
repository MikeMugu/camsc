/**
* Provides general utility methods throughout the application.
*/
GenUtil = {
    
    /**
    * Sends an error response (500) back using the supplied response object and message string.
    *
    * @param res The response object to use.
    * @param message String representing the error message to send.
    */
    sendError: function(res, message) {
        res.status(500).json({ error: message });
    },
    
    /**
    * Cleans the passed in query of any regular expression values that may be passed in. 
    * The cleaned query is then passed to the onQuery callback.
    *
    * @param query The query to clean
    * @param onQuery Callback function to execute once query is cleaned.
    */
    cleanQuery: function(query, onQuery) {
        var cleanedQuery = {};
        
        try {
            cleanedQuery = JSON.parse(query);
            
            var index = query.indexOf('/');
            if (index > -1) {
                // This is a regular expression
                var left = query.substring(0, index - 1);
                var right = query.substr(index, query.length - index);
                
                // clean the string
                left = left.replace(/{/g, '');
                left = left.replace(/\"/g, '');
                left = left.replace(/:/g, '');
                left = left.replace(/</g, '');
                right = right.replace(/\//g, '');
                right = right.replace(/\//g, '');
                right = right.replace(/\"/g, '');
                right = right.replace(/>/g, '');
                
                left = left.trim();
                right = right.trim();
                
                cleanedQuery[left] = { $regex: right, $options: 'ig' };
            }
            
            onQuery(cleanedQuery);
        }
        catch (err) {
            // Invalid JSON
            onQuery(null, { message: 'Invalid JSON object passed in query: ' + query + '. ' + err.message });
        }
    },
    
    tryParseJson: function (data, onJson) {
        try {
            // Try parsing the JSON object.
            json = JSON.parse(data);

            onJson(json);
        }
        catch (err) {
            // Invalid JSON.
            onJson(null, { message: 'Invalid JSON object passed in query: ' + data + '. ' + err.message });
        }
    },
    
    isScriptInjection: function (req, res, json) {
        var result = false;

        if (req.query['script'] != '1') {
            // Enforce no script tags in json data, unless url contains ?script=1
            if (JSON.stringify(json).toLowerCase().indexOf('<script') != -1) {
                result = true;
            }
        }

        return result;
    },
    
    isAdmin: function (req) {
        var ip = req.connection.remoteAddress;
        
        console.log('Checking for admin for remote ip ' + ip);
        
        var result = ((ip == '127.0.0.1' || ip == '99.98.184.48' || ip == '127.13.163.129') && req.query['admin'] == '1');
        if (result) {
            console.log('Granting permission to edit the site to remote ip ' + ip);
        }
        
        return result;
    }
};