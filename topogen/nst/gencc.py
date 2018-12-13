class CCcode:
    cc_code = ""
    def __init__(self,cc_filename):
        self.add_gnu_emac_header_comment()
        self.add_license()

    def add_gnu_emac_header_comment(self):
        header = '/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */'
        self.break_line()
        self.append_code(header)

    def add_license(self):
        license = '/* \n \
        * This program is free software; you can redistribute it and/or modify \n \
        * it under the terms of the GNU General Public License version 2 as \n \
        * published by the Free Software Foundation; \n \
        * \n \
        * This program is distributed in the hope that it will be useful, \n \
        * but WITHOUT ANY WARRANTY; without even the implied warranty of \n \
        * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the \n \
        * GNU General Public License for more details. \n \
        * \n \
        * You should have received a copy of the GNU General Public License \n \
        * along with this program; if not, write to the Free Software \n \
        * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA \n \
        */'
        self.break_line()
        self.append_code(license)
    
    def add_main(self):
        main_def = "int main (int argc, char *argv[])"
        self.break_line()
        self.append_code(main_def)
    
    def add_open_brackets(self):
        self.break_line()
        self.append_code('{')
    
    def add_close_brackets(self):
        self.break_line()
        self.append_code('}')
    
    def break_line(self):
        self.cc_code = self.cc_code + '\n'
    
    def append_code(self,code):
        self.cc_code = self.cc_code + code

def genCC(nst):
    