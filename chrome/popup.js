document.addEventListener('DOMContentLoaded', function() {
    var sendButton      = document.getElementById('sendReport');
    var numResolved     = document.getElementById('num-resolved');
    var numReported     = document.getElementById('num-reported');
    var numSuccess      = document.getElementById('num-success');
    var numFixed        = document.getElementById('num-fixed');

    chrome.runtime.sendMessage({
        function: 'countUnresolved',
        data: {}
    }, function(response) {
        if (response) {
            numResolved.innerHTML   = response.resolved ? response.resolved : '0';
            numReported.innerHTML   = response.reported ? response.reported : '0';
            numSuccess.innerHTML    = response.success ? response.success : '0';
            numFixed.innerHTML      = response.fixed ? response.fixed : '0';
        }
    });

    sendButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({
                function: 'postData',
                data: {
                    url: tabs[0].url ?  tabs[0].url : '',
                }
            }, function(response) {
                console.log(response);
                chrome.runtime.sendMessage({
                    function: 'countUnresolved',
                    data: {}
                }, function(response) {
                    if (response.count) {
                        numUnreolved.innerHTML = response.count;
                    }
                });
            });
        });
    }, false);
}, false);