using API.Interfaces;
using API.Models;

namespace API;

public class UserConnectionManager : IUserConnectionManager
{
    private readonly IDictionary<string, UserConnection> _connections = new Dictionary<string, UserConnection>();

    public void AddConnection(string connectionId, UserConnection userConnection)
    {
        _connections[connectionId] = userConnection;
    }

    public void RemoveConnection(string connectionId)
    {
        _connections.Remove(connectionId);
    }

    public UserConnection? GetConnection(string connectionId)
    {
        _connections.TryGetValue(connectionId, out var userConnection);
        return userConnection;
    }

    public IEnumerable<UserConnection> GetConnectionsByRoom(string room)
    {
        return _connections.Values.Where(c => c.Room == room);
    }
}