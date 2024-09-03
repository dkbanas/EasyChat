using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class ChatHub : Hub
{
    private readonly string _botUser;
    private readonly IUserConnectionManager _connectionManager;

    public ChatHub(IUserConnectionManager connectionManager)
    {
        _botUser = "MyChat Bot";
        _connectionManager = connectionManager;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userConnection = _connectionManager.GetConnection(Context.ConnectionId);

        if (userConnection != null)
        {
            _connectionManager.RemoveConnection(Context.ConnectionId);
            Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
            SendUsersConnected(userConnection.Room);
        }

        return base.OnDisconnectedAsync(exception);
    }

    public async Task JoinRoom(UserConnection userConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

        _connectionManager.AddConnection(Context.ConnectionId, userConnection);

        await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined {userConnection.Room}");

        await SendUsersConnected(userConnection.Room);
    }

    public async Task SendMessage(string message)
    {
        var userConnection = _connectionManager.GetConnection(Context.ConnectionId);

        if (userConnection != null)
        {
            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
        }
    }

    public Task SendUsersConnected(string room)
    {
        var users = _connectionManager.GetConnectionsByRoom(room)
            .Select(c => c.User);

        return Clients.Group(room).SendAsync("UsersInRoom", users);
    }
}
