$(function () {

    /*  delegated AJAX POST handler for adding/registering roles */
    $(document).on('submit', '.ajaxRegisterClient', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#registerClientModal').modal('hide');
                
                if (response.success) {

                     let clientsTable = '';

                     for (let i = 0; i < response.clients.length; i++) {

                        clientsTable += '<tr>'+
                                            '<td>'+ response.clients[i].firstname +' '+ response.clients[i].surname +'</td>'+
                                            '<td>'+ response.clients[i].email +'</td>'+
                                            '<td>'+ response.clients[i].phone +'</td>'+
                                            '<td>'+ response.clients[i].company +'</td>'+
                                            '<td>'+ response.clients[i].position +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.clients[i].id +'" class="btn btn-warning ajaxGetClient" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i> </button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".clientsHere").html(clientsTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#registerClientModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for adding/registering client */

    // Handle client edit modal
    $(document).on('click', '.ajaxGetClient', function () {
        
        const id = $(this).data('id');
        const $modal = $('#editClientModal');
        const $form  = $modal.find('.ajaxUpdateClient');

        $.ajax({
            url: '/api/marketer/edit/client/' + id,
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            success: function (res) {

                if (!res.success) {
                            alert('Not found');
                            $modal.modal('hide');
                            return;
                }

                $form.attr('action', '/api/marketer/client/update/' + id);
                $form.find('input[name="firstname"]').val(res.client.firstname);
                $form.find('input[name="surname"]').val(res.client.surname);
                $form.find('input[name="phone"]').val(res.client.phone);
                $form.find('input[name="email"]').val(res.client.email);
                $form.find('input[name="company"]').val(res.client.company);
                $form.find('input[name="position"]').val(res.client.position);
                $modal.modal('show');
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of edit client

    /*  delegated AJAX POST handler for updating client */
    $(document).on('submit', '.ajaxUpdateClient', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#editClientModal').modal('hide');
                
                if (response.success) {

                     let clientsTable = '';

                     for (let i = 0; i < response.clients.length; i++) {

                        clientsTable += '<tr>'+
                                            '<td>'+ response.clients[i].firstname +' '+ response.clients[i].surname +'</td>'+
                                            '<td>'+ response.clients[i].email +'</td>'+
                                            '<td>'+ response.clients[i].phone +'</td>'+
                                            '<td>'+ response.clients[i].company +'</td>'+
                                            '<td>'+ response.clients[i].position +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.clients[i].id +'" class="btn btn-warning ajaxGetClient" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i> </button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".clientsHere").html(clientsTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#editClientModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    // end of updating 
});