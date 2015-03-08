<div class="cms-page favorites-page container-fluid">
	<ul class="nav nav-tabs" role="tablist">
		<li>
			<a href="/user/view?id=<%= user.id %>">Datos</a>
		</li>
		<li>
			<a href="/user/favorites?id=<%= user.id %>">Favoritos</a>
		</li>
		<li class="active">
			<a>Mensajes</a>
		</li>
	</ul>
	<h2>Mensajes</h2>
	<table class="table table-hover table-admin">
		<thead>
			<th></th>
			<th>Nombre</th>
			<th>Email</th>
			<th>Teléfono</th>
			<th>Opciones</th>
		</thead>
		<tbody>
			<% for(var i=0; i < organizations.length; i++) { %>
			<tr>
				<td>
					<img src="/images/<%= organizations[i].avatar %>" alt="Organization photo" class="img-circle img-small" />
				</td>
				<td><a href="/organization/view?id=<%= organizations[i].id %>"><%= organizations[i].name %></td>
				<td><%= organizations[i].email %></td>
				<td><%= organizations[i].requiredPhone %></td>
				<td>
					<a href="/favorite/remove?idUser=<%= user.id %>&idOrganization=<%= organizations[i].id %>" class="btn btn-danger" id="removeFavorite" title="Eliminar de favoritos">
						<span class="glyphicon glyphicon-star"></span>
					</a>
				</td>
			</tr>
			<% } %>
		</tbody>
	</table>
</div>