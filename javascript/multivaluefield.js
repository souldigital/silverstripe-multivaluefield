jQuery(function($) {
	function addNewField() {
		var self = $(this),
			val = self.val(),
			parentul = self.parents("ul.multivaluefieldlist"),
			forced = parentul.hasClass("forced"),
			nth = self.parents("li").index(),
			linked_id = self.data("linked"),
			linked_ul = $("div#"+linked_id).find("ul"),
			linked_input = linked_ul.find(".mventryfield:eq("+nth+")"),
			detach = self.hasClass('detach');

		// check to see if the one after us is there already - if so, we don't need a new one
		var li = $(this).closest('li').next('li');

		if (!val && !forced && !detach) {
			// lets also clean up if needbe
			var nextText = li.find('input.mventryfield');
			var detach = true;

			nextText.each (function () {
				if ($(this) && $(this).val() && $(this).val().length > 0) {
					detach = false;
				}
			});

			if(linked_id && linked_input.val()){
				detach = false;
			}

			if (detach) {
				li.detach();
				parentul.trigger('multiValueFieldRemoved');
			}

		} else {
			if ( (li.length && !forced) ) {
				return;
			}

			var append = self.closest("li").clone()
				.find(".has-chzn").show().removeClass("").data("chosen", null).end()
				.find(".chzn-container").remove().end();

			// Assign the new inputs a unique ID, so that chosen picks up
			// the correct container.
			append.find("input, select").val("").attr("id", function() {
				var pos = this.id.lastIndexOf(":");
				var num = parseInt(this.id.substr(pos + 1));

				return this.id.substr(0, pos + 1) + (num + 1).toString();
			});

			append.appendTo(parentul);
		}

		$(this).trigger('multiValueFieldAdded');

		if(linked_id && ( !forced || detach )){
			var linked_iterations = Math.abs( linked_ul.find("li").length - parentul.find("li").length );

			if(linked_iterations > 0){
				linked_ul.addClass("forced");
				if(!forced && detach)
				linked_ul.addClass("detach");
				linked_input.trigger('focusout');
				linked_ul.removeClass("detach forced");
			}
		}
	}

	$(document).on("keyup, focusout", ".mventryfield", addNewField);
	$(document).on("change", ".mventryfield:not(input)", addNewField);
	
	if ($.entwine) {
		$('ul.multivaluefieldlist').entwine({
			onmatch: function () {
				$(this).sortable();
			}
		})
	}
	
});
