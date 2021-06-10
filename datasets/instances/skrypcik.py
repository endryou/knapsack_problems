import random


def main():
	for f in range(1, 11):
		outfile = open('100_'+(str(f))+'.txt', 'w')
		items = 1000000
	
		for i in range(items):
			num = random.randint(200, 600)
			num2 = random.randint(400, 1000)
			outfile.write(str(num)+' '+str(num2)+'\n')
		outfile.close()
		print('data written to file 100_'+(str(f))+'.txt')
		
main()
