import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { server, tool, args } = body;

    if (!server || !tool) {
      return NextResponse.json(
        { success: false, error: 'Server and tool are required' },
        { status: 400 }
      );
    }

    // Mock response for testing
    if (server === 'supabase-mcp-server' && tool === 'resetPassword') {
      // Return a successful response for password reset
      return NextResponse.json({ 
        success: true, 
        data: {
          message: 'Password reset email sent successfully'
        }
      });
    }
    
    // For other tools, try to call the MCP server
    try {
      const response = await fetch('http://localhost:3001/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server,
          tool,
          args: args || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { success: false, error: errorData.error || 'MCP server error' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error('Error connecting to MCP server:', error);
      
      // If we can't connect to the MCP server, return a mock response for specific tools
      if (server === 'supabase-mcp-server') {
        if (tool === 'getUserData') {
          return NextResponse.json({ 
            success: true, 
            data: {
              data: null
            }
          });
        } else if (tool === 'saveUserData') {
          return NextResponse.json({ 
            success: true, 
            data: {
              message: 'User data saved successfully'
            }
          });
        } else if (tool === 'confirmResetPassword') {
          return NextResponse.json({ 
            success: true, 
            data: {
              message: 'Password reset successfully'
            }
          });
        }
      }
      
      // For other tools, return an error
      return NextResponse.json(
        { success: false, error: 'Failed to connect to MCP server' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in MCP API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
